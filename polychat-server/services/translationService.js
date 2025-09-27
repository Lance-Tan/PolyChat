const axios = require('axios');

class TranslationService {
  constructor() {
    this.translationService = process.env.TRANSLATION_SERVICE || 'libre';
    this.libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
  }

  /**
   * Translate text from source language to target language
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code (e.g., 'es', 'fr')
   * @param {string} sourceLanguage - Source language code (default: 'auto')
   * @returns {Promise<string>} Translated text
   */
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      const response = await axios.post(`${this.libreTranslateUrl}/translate`, {
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Get supported languages from LibreTranslate
   * @returns {Promise<Array>} List of supported languages
   */
  async getSupportedLanguages() {
    try {
      const response = await axios.get(`${this.libreTranslateUrl}/languages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      return [];
    }
  }
}

module.exports = new TranslationService();
