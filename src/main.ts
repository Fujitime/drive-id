import { updateHistoryList, addToHistory, extractFileId } from './history';
import Swal from 'sweetalert2';

const generateImageButton = document.getElementById('generateImageButton') as HTMLButtonElement;
const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
const historyList = document.getElementById('historyList') as HTMLUListElement;
const googleDriveLinkInput = document.getElementById('googleDriveLink') as HTMLInputElement;
const copyButton = document.getElementById('copyButton') as HTMLButtonElement;
const imageCode = document.getElementById('imageCode') as HTMLElement; 
const imageCodeContainer = document.getElementById('imageCodeContainer') as HTMLDivElement;

generateImageButton.addEventListener('click', () => {
  generateImageCode();
});

copyButton.addEventListener('click', () => {
  copyFormula();
});


window.addEventListener('DOMContentLoaded', () => {
  const historyList = document.getElementById('historyList') as HTMLUListElement;
  const googleDriveLinkInput = document.getElementById('googleDriveLink') as HTMLInputElement;

  updateHistoryList(historyList, googleDriveLinkInput, generateImageCode, 1);
});


function generateImageCode() {
  const googleDriveLink = googleDriveLinkInput.value;
  const fileId = extractFileId(googleDriveLink);

  if (!fileId) {
    Swal.fire('Invalid Link', 'Please provide a valid Google Drive link.', 'error');
    return;
  }
  const imageUrl = `https://drive.google.com/uc?id=${fileId}`;
  imagePreview.src = imageUrl;
  imagePreview.style.maxWidth = '750px';
  imagePreview.style.maxHeight = '450px';
  imagePreview.style.objectFit = 'contain';
  imagePreview.style.border = '1px solid #ccc'; // Style border
  imagePreview.style.margin = '10px'; // Margin 10px
  imagePreview.style.padding = '5px'; // Padding 5px
  imagePreview.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.1)'; // Efek bayangan
  imagePreview.style.borderRadius = '8px'; // Border radius 8px
  

  addToHistory(googleDriveLink);
  updateHistoryList(historyList, googleDriveLinkInput, generateImageCode, 1); 
  imageCode.textContent = `=IMAGE("${imageUrl}")`;
  imageCodeContainer.classList.remove('hidden');

  localStorage.setItem('lastUsedId', fileId);
}

function copyFormula() {
  const range = document.createRange();
  range.selectNode(imageCode);
  
  const selectedText = window.getSelection();
  if (selectedText !== null) {
    selectedText.removeAllRanges();
    selectedText.addRange(range);
    document.execCommand('copy');
    selectedText.removeAllRanges();
    showCopyNotification();
  }
}

function showCopyNotification() {
  Swal.fire('Copied!', 'The formula has been copied to your clipboard.', 'success');
}

const lastUsedId = localStorage.getItem('lastUsedId');
if (lastUsedId) {
  googleDriveLinkInput.value = `https://drive.google.com/file/d/${lastUsedId}/view?usp=sharing`;
  generateImageCode();
}
document.addEventListener('DOMContentLoaded', () => {
  const historyList = document.getElementById('historyList') as HTMLUListElement;
  const googleDriveLinkInput = document.getElementById('googleDriveLink') as HTMLInputElement;


  const pagination = document.getElementById('pagination');
  if (pagination) {
    pagination.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        event.preventDefault();
        const currentPage = parseInt(event.target.textContent || '1', 10); 
        updateHistoryList(historyList, googleDriveLinkInput, generateImageCode, currentPage);
      }
    });
  }

  updateHistoryList(historyList, googleDriveLinkInput, generateImageCode, 1);
});
