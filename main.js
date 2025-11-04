import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.json())

const ENDPOINT = 'https://test.icorp.uz/interview.php'
const PORT = 3005

// Callback kutish uchun Map
const pending = new Map()

// Callback endpoint
app.post('/callback', (req, res) => {
    try {
        const token = req.query.token
        const secondPart = req.body.part || req.query.part || ''
        if (pending.has(token)) {
            pending.get(token)(secondPart) // resolve funksiyasini chaqirish
            pending.delete(token)
        }
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
})

app.get('/run', async (req, res) => {
    try {
        // Token va callback URL tayyorlash
        const token = Date.now().toString(36)

        // Agar localhost ishlatsangiz, tashqi API callback yuborolmaydi
        // Shu sababli ngrok orqali ochiq URL kerak
        const callbackUrl = `${req.protocol}://${req.get('host')}/callback?token=${token}`

        // 1️⃣ POST yuborish va birinchi qism kodni olish
        const postResp = await axios.post(
            ENDPOINT,
            { msg: 'hello', url: callbackUrl },
            { responseType: 'text' }
        )
        const firstPart = postResp.data.trim()

        // 2️⃣ Callbackni kutish (max 60 soniya)
        const secondPart = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Timeout: callback kelmadi')), 60000)
            pending.set(token, p => {
                clearTimeout(timer)
                resolve(p)
            })
        })

        // 3️⃣ Kodlarni birlashtirish
        const combinedCode = firstPart + secondPart

        // 4️⃣ GET yuborish va yakuniy xabarni olish
        const getResp = await axios.get(ENDPOINT, {
            params: { code: combinedCode },
            responseType: 'text'
        })
        const message = getResp.data.trim()

        // 5️⃣ Natijani qaytarish
        res.json({ combinedCode, message })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
