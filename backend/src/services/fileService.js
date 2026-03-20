import fs from 'fs/promises';

/**
 * Extract plain text from an uploaded file for use as AI context.
 * @param {import('multer').File} file - Multer file object
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file) {
  if (file.mimetype === 'text/plain') {
    return await fs.readFile(file.path, 'utf8');
  }

  // TODO: Add PDF text extraction using pdf-parse:
  //   npm install pdf-parse
  //   import pdfParse from 'pdf-parse';
  //   const buffer = await fs.readFile(file.path);
  //   const data = await pdfParse(buffer);
  //   return data.text;

  // TODO: Add DOCX text extraction using mammoth:
  //   npm install mammoth
  //   import mammoth from 'mammoth';
  //   const result = await mammoth.extractRawText({ path: file.path });
  //   return result.value;

  return `[Text extraction not yet implemented for ${file.mimetype}. Integrate pdf-parse or mammoth.]`;
}
