import fs from 'node:fs/promises'
import * as Path from 'node:path'

const dataPath = Path.resolve('./server/data/data.json')
export async function getPuppiesData() {
  try {
    return await fs.readFile(dataPath, `utf-8`).then((data) => JSON.parse(data))
  } catch (err) {
    console.error(err.message)
  }
}

export async function getPuppiesId(id) {
  try {
    const puppyData = await getPuppiesData()
    return puppyData.puppies.find((puppy) => puppy.id === id)
  } catch (err) {
    console.error(err)
  }
}

export async function updatePuppy(puppy) {
  try {
    const puppyData = await getPuppiesData()
    const matchPuppy = puppyData.puppies.find((pup) => pup.id === puppy.id)
    const { name, owner, image, breed } = puppy
    matchPuppy.name = name
    matchPuppy.owner = owner
    matchPuppy.image = image
    matchPuppy.breed = breed
    await updatePuppyInfo(puppyData)
  } catch (err) {
    console.error(err)
  }
}

export async function addPuppy(puppy) {
  try {
    const puppyData = await getPuppiesData()
    puppyData.puppies.push(puppy)
    await updatePuppyInfo(puppyData)
  } catch (err) {
    console.error(err)
  }
}

export async function updatePuppyInfo(data) {
  const newInfo = JSON.stringify(data, null, 2)
  await fs.writeFile(dataPath, newInfo, 'utf-8')
}

export async function deletePuppy(id) {
  const puppyData = await getPuppiesData()
  const data = puppyData.puppies.filter((pup) => pup.id !== id)
  puppyData.puppies= data
  updatePuppyInfo(puppyData)
}
