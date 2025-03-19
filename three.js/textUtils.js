export function createTextBox(content, top, left) {
    const textBox = document.createElement('div');
    textBox.textContent = content;
    textBox.style.position = 'fixed';
    textBox.style.top = top;
    textBox.style.left = left;
    textBox.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Cor de fundo com opacidade
    textBox.style.padding = '10px';
    textBox.style.margin = '10px';
    textBox.style.border = '2px solid black';
    textBox.style.fontFamily = "'Martian Mono', monospace"; 
    document.body.appendChild(textBox);

    setTimeout(function() {
        document.body.removeChild(textBox);
    }, 10000);
    
    return textBox;
}