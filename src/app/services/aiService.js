// app/services/aiService.js - Con fallback automático
import Groq from 'groq-sdk';

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY no configurada');
    }
    
    this.groq = new Groq({ apiKey: this.apiKey });
    
    // Lista de modelos en orden de preferencia
    this.modelosPreferidos = [
      "llama-3.3-70b-versatile",  // Mejor calidad
      "llama-3.1-8b-instant",      // Más rápido
      "mixtral-8x7b-32768",        // Alternativa
      "gemma2-9b-it"               // Último recurso
    ];
    
    this.modeloActual = 0;
  }
  
  async generateInsight(prompt) {
    let ultimoError = null;
    
    // Probar cada modelo hasta que uno funcione
    for (let i = 0; i < this.modelosPreferidos.length; i++) {
      const model = this.modelosPreferidos[i];
      
      try {
        console.log(`Intentando con modelo: ${model}`);
        
        const completion = await this.groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "Eres un experto analista de negocios. Responde en español de forma clara y profesional."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 600,
        });
        
        const insight = completion.choices[0]?.message?.content;
        if (insight) {
          console.log(`✅ Modelo exitoso: ${model}`);
          return { insight, model };
        }
        
      } catch (error) {
        console.warn(`❌ Modelo ${model} falló:`, error.message);
        ultimoError = error;
        
        // Si es error de modelo descontinuado, continuar con el siguiente
        if (error.message?.includes('decommissioned')) {
          continue;
        }
        
        // Si es otro error (API key, red), romper el ciclo
        if (error.status === 401 || error.status === 429) {
          throw error;
        }
      }
    }
    
    throw new Error(`No hay modelos disponibles. Último error: ${ultimoError?.message}`);
  }
}

export function getAIService() {
  return new AIService();
}