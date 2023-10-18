import express from 'express'
import * as lib from './lib.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    const puppyData = await lib.getPuppiesData()

    const id = req.params.id
    const puppy = puppyData.puppies.find((pup) => pup.id == id)
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

router.post('/edit/:id', async(req,res)=>{
  try{
    const id = Number(req.params.id) 
  const {name, owner, image, breed} = req.body
  const puppy = {id, name,owner, image, breed}
 await lib.updatePuppy(puppy)

 res.redirect(`/${id}`)
    
  }catch(err){
    console.error(err)
  }
})

export default router
