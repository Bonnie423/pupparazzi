import express from 'express'
import * as lib from './lib.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
  try{

    const puppies = await lib.getPuppiesData()
  
    res.render('home', puppies)
  }catch(err){
    console.error('data fetch failed')
    res.status(500)
  }
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/new', upload.single('image'), async (req, res) => {
  try {
    let image = ''
    if (req.file) {
      image = `images/${req.file.originalname}`
    } else if (req.body.imageURL) {
      image = req.body.imageURL
    }
    const { name, owner, breed } = req.body
    const puppyData = await lib.getPuppiesData()
    const id = puppyData.puppies.length + 1
    const puppy = { id, name, owner, image, breed }
    lib.addPuppy(puppy)
    res.redirect(`/${id}`)
  } catch (err) {
    console.error(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const puppyData = await lib.getPuppiesData()

    const id = Number(req.params.id)
    const puppy = puppyData.puppies.find((pup) => pup.id === id)
    res.render('details', puppy)
  } catch (err) {
    console.error('somthing went wrong')
  }
})

router.get('/edit/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const puppy = await lib.getPuppiesId(id)
    res.render('edit', puppy)
  } catch (err) {
    console.error(err)
  }
})

router.post('/edit/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, owner, image, breed } = req.body
    const puppy = { id, name, owner, image, breed }
    await lib.updatePuppy(puppy)

    res.redirect(`/${id}`)
  } catch (err) {
    console.error(err)
  }
})

router.post('/delete/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await lib.deletePuppy(id)
    res.render(`delete`)
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to delete the puppy.')
  }
})

export default router
