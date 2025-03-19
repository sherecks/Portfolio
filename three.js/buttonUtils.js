export function createButton(text, top, left) {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = text;
    buttonElement.style.position = 'fixed';
    buttonElement.style.top = top;
    buttonElement.style.left = left;
    buttonElement.style.backgroundColor = 'black';
    buttonElement.style.padding = '5px'
    buttonElement.style.color = 'white';
    buttonElement.style.fontSize = '16px';
    buttonElement.style.border = '2px solid white';
    buttonElement.style.fontFamily = "'Martian Mono', monospace"; 
    buttonElement.style.cursor = 'pointer'; 
    document.body.appendChild(buttonElement); 

    return buttonElement;
}