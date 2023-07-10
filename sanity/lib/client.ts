import { createClient } from 'next-sanity'

import {
  apiVersion, dataset, projectId, useCdn,
  // token
} from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  withCredentials: true,
})



export const serverClient =  createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token: process.env.SANITY_API_TOKEN,
})
