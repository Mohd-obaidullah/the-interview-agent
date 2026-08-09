const pdfParse = require('pdf-parse');

const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF parsing error:', error.message);
    return 'Failed to extract text from PDF file.';
  }
};

module.exports = { parsePDF };
