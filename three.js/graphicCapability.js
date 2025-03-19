// Graphics!!!
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');


export function isGraphicsCapabilitySufficient() {
    if (!gl) {
      console.log("WebGL não é suportado");
      return false;
    }
  
    const requiredExtension = 'OES_texture_float';
    const extensionSupported = gl.getExtension(requiredExtension) !== null;
  
    // Verifique a potência da GPU (neste exemplo, verifica o tamanho máximo de textura suportado)
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const minRequiredTextureSize = 512; // Tamanho mínimo de textura necessário
  
    if (extensionSupported && maxTextureSize >= minRequiredTextureSize) {
      console.log("OK - Capacidade gráfica é suficiente");
      return true;
    } else {
      console.log("A capacidade gráfica não é suficiente");
      return false;
    }
  }
  window.addEventListener('load', isGraphicsCapabilitySufficient);