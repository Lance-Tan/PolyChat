const { spawn } = require('child_process');
const config = require('../config/config');

class TranslationService {
  constructor() {
    this.llmConfig = config.translation.llm;
  }

  /**
   * Translate text from source language to target language using LLM
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code (e.g., 'es', 'fr')
   * @param {string} sourceLanguage - Source language code (unused for LLM, kept for compatibility)
   * @returns {Promise<string>} Translated text
   */
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    console.log(`Translating: "${text}" to ${targetLanguage}`);
    try {
      const result = await this._translateWithLLM(text, targetLanguage);
      console.log(`Translation result: "${result}"`);
      return result;
    } catch (error) {
      console.error('Translation error:', error.message);
      console.log(`Returning original text: "${text}"`);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Translate using LLM via Python script
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<string>} Translated text
   */
  async _translateWithLLM(text, targetLanguage) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['translator.py'], {
        cwd: __dirname + '/..',
        env: {
          ...process.env,
          BASE_URL: this.llmConfig.baseUrl,
          API_KEY: this.llmConfig.apiKey,
          MODEL: this.llmConfig.model,
          LLM_TEMPERATURE: this.llmConfig.temperature.toString(),
          LLM_SYSTEM_PROMPT: this.llmConfig.systemPrompt || '',
          TEXT: text,
          TARGET_LANGUAGE: targetLanguage,
          PYTHONIOENCODING: 'utf-8'
        },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Python script failed with code ${code}: ${error}`));
        }
      });

      pythonProcess.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Get supported languages for LLM-based translation
   * @returns {Promise<Array>} List of supported languages
   */
  async getSupportedLanguages() {
    return this._getLLMSupportedLanguages();
  }

  /**
   * Get supported languages for LLM-based translation
   * @returns {Array} List of supported languages
   */
  _getLLMSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'nl', name: 'Dutch' },
      { code: 'sv', name: 'Swedish' },
      { code: 'da', name: 'Danish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'pl', name: 'Polish' },
      { code: 'tr', name: 'Turkish' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ms', name: 'Malay' },
      { code: 'tl', name: 'Filipino' },
      { code: 'he', name: 'Hebrew' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'cs', name: 'Czech' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'ro', name: 'Romanian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'hr', name: 'Croatian' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'et', name: 'Estonian' },
      { code: 'lv', name: 'Latvian' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'el', name: 'Greek' },
      { code: 'is', name: 'Icelandic' },
      { code: 'ga', name: 'Irish' },
      { code: 'mt', name: 'Maltese' },
      { code: 'cy', name: 'Welsh' },
      { code: 'eu', name: 'Basque' },
      { code: 'ca', name: 'Catalan' },
      { code: 'gl', name: 'Galician' }
    ];
  }
}

module.exports = new TranslationService();
