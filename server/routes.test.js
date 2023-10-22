import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'

import server from './server.js'
import { render } from '../test-utils.js'

import * as lib from './lib.js'

vi.mock('./lib.js')

const mockPuppies ={
  puppies:[
    {
      id: 1,
      name: "Fido",
      owner: "Fred",
      image: "/images/puppy1.jpg",
      breed: "Labrador"
    },
    {
      id: 2,
      name: "Snow",
      owner: "Bonnie",
      image: "/images/puppy2.jpg",
      breed: "Labrador"
    }
  ]
}

describe('get /', async()=>{
  it('should show a list of puppies', async()=>{

    vi.mocked(lib.getPuppiesData).mockImplementation(async()=>{
      return mockPuppies
    })

    const res = await request(server).get('/')
    const screen = render(res)

    const snowImage = screen.getByAltText('Snow')
    expect(snowImage.src).toBe('/images/puppy2.jpg')
  })

  it('should show an error and status 500', async()=>{
    vi.mocked(lib.getPuppiesData).mockImplementationOnce(async()=>{
      throw new Error('data fetch failed')
    })
    //  const res = request(server).get('/')
    //  expect( res.statusCode).toBe(500)
  })
})