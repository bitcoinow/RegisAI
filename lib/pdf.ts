// Server-side only. Do not import this in client components.
// Uses pdf-parse, not pdf.js — pdf.js requires a browser environment.

import pdfParse from 'pdf-parse'

export interface ParsedPdf {
  text: string
  pageCount: number
}

export async function extractTextFromPdf(buffer: Buffer): Promise<ParsedPdf> {
  const data = await pdfParse(buffer)
  return {
    text: data.text,
    pageCount: data.numpages,
  }
}
