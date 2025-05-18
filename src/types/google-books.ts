// types/google-books.ts
import { z } from 'zod'

// Define the schemas for nested objects first
const imageLinksSchema = z.object({
  smallThumbnail: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  small: z.string().url().optional(),
  medium: z.string().url().optional(),
  large: z.string().url().optional(),
  extraLarge: z.string().url().optional(),
})

const industryIdentifierSchema = z.object({
  type: z.string(),
  identifier: z.string(),
})

const volumeInfoSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()).optional(),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
  industryIdentifiers: z.array(industryIdentifierSchema).optional(),
  pageCount: z.number().optional(),
  dimensions: z.object({
    height: z.string().optional(),
    width: z.string().optional(),
    thickness: z.string().optional(),
  }).optional(),
  printType: z.string().optional(),
  categories: z.array(z.string()).optional(),
  averageRating: z.number().optional(),
  ratingsCount: z.number().optional(),
  imageLinks: imageLinksSchema.optional(),
  language: z.string().optional(),
  previewLink: z.string().url().optional(),
  infoLink: z.string().url().optional(),
  canonicalVolumeLink: z.string().url().optional(),
})

const saleInfoSchema = z.object({
  country: z.string(),
  saleability: z.string(),
  isEbook: z.boolean(),
  listPrice: z.object({
    amount: z.number(),
    currencyCode: z.string(),
  }).optional(),
  retailPrice: z.object({
    amount: z.number(),
    currencyCode: z.string(),
  }).optional(),
  buyLink: z.string().url().optional(),
})

const accessInfoSchema = z.object({
  country: z.string(),
  viewability: z.string(),
  embeddable: z.boolean(),
  publicDomain: z.boolean(),
  textToSpeechPermission: z.string(),
  epub: z.object({
    isAvailable: z.boolean(),
    acsTokenLink: z.string().url().optional(),
  }).optional(),
  pdf: z.object({
    isAvailable: z.boolean(),
    acsTokenLink: z.string().url().optional(),
  }).optional(),
  webReaderLink: z.string().url().optional(),
  accessViewStatus: z.string(),
  quoteSharingAllowed: z.boolean(),
})

// Main book schema
export const googleBookSchema = z.object({
  kind: z.string(),
  id: z.string(),
  etag: z.string(),
  selfLink: z.string().url(),
  volumeInfo: volumeInfoSchema,
  saleInfo: saleInfoSchema,
  accessInfo: accessInfoSchema,
})

// Response schema for search results
export const googleBooksResponseSchema = z.object({
  kind: z.string(),
  totalItems: z.number(),
  items: z.array(googleBookSchema).optional(),
})

// Export types
export type GoogleBook = z.infer<typeof googleBookSchema>
export type GoogleBooksResponse = z.infer<typeof googleBooksResponseSchema>