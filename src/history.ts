import Swal from 'sweetalert2';
const HISTORY_STORAGE_KEY = 'history';

export function getHistory(): string[] {
  const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
  return historyJson ? JSON.parse(historyJson) : [];
}

export function saveHistory(history: string[]): void {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function addToHistory(link: string): void {
  const history = getHistory();
  if (!history.includes(link)) {
    history.unshift(link);
    saveHistory(history);
  }
}

export function deleteFromHistory(index: number): void {
  const history = getHistory();
  history.splice(index, 1);
  saveHistory(history);
}

export function updateHistoryList(
  historyList: HTMLUListElement,
  googleDriveLinkInput: HTMLInputElement,
  generateImageCode: () => void,
  currentPage: number
): void {
  historyList.innerHTML = '';

  const history = getHistory();
  const itemsPerPage = 10; 

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = startIndex; i < endIndex && i < history.length; i++) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    const thumbnail = document.createElement('img');
    thumbnail.src = `https://drive.google.com/thumbnail?id=${extractFileId(history[i])}`;
    thumbnail.alt = 'Google Drive Thumbnail';
    thumbnail.className = 'history-thumbnail mr-2';

    listItem.appendChild(thumbnail);

    const linkText = document.createElement('span');
    linkText.textContent = history[i];
    listItem.appendChild(linkText);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger delete-button';
    listItem.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
      showDeleteConfirmation(i, historyList, googleDriveLinkInput, generateImageCode);
    });

    historyList.appendChild(listItem);
  }

const pagination = document.getElementById('pagination');
if (pagination) {
  pagination.innerHTML = '';

  const totalPages = Math.ceil(history.length / itemsPerPage);

  //native harga mati bro apa itu framework? scss?
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.style.display = 'inline-block';
    pageItem.style.listStyle = 'none';
    pageItem.style.margin = '0 5px';
    pageItem.style.color = '#007bff';
    pageItem.style.textDecoration = 'none';
    pageItem.style.transition = 'color 0.3s ease-in-out';

    const pageLink = document.createElement('a');
    pageLink.style.textDecoration = 'none';
    pageLink.style.color = 'inherit';
    pageLink.textContent = i.toString();
    pageLink.href = '#';

    pageItem.appendChild(pageLink);
    pagination.appendChild(pageItem);
  }
}
}
export function showDeleteConfirmation(
    index: number,
    historyList: HTMLUListElement,
    googleDriveLinkInput: HTMLInputElement,
    generateImageCode: () => void
  ): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this link from history!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFromHistory(index);
        updateHistoryList(historyList, googleDriveLinkInput, generateImageCode, 1);
        Swal.fire('Deleted!', 'The link has been deleted from history.', 'success');
      }
    });
  }
  function extractFileId(url: string): string | null {
    const match = url.match(/\/file\/d\/(.+?)\//);
    return match ? match[1] : null;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('historyList') as HTMLUListElement;
    const googleDriveLinkInput = document.getElementById('googleDriveLink') as HTMLInputElement;
    const generateImageCode = () => {
    };
  
    updateHistoryList(historyList, googleDriveLinkInput, generateImageCode, 1);
  });

export {extractFileId}