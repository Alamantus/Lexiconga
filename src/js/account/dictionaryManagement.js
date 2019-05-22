import { saveEditModal } from "../dictionaryManagement";
import { syncDetails } from "./sync";
import { addMessage } from "../utilities";

export function saveEditModalAndSync() {
  saveEditModal();
  
  return syncDetails().then(successful => {
    if (successful) {
      addMessage('Synced Successfully');
    } else {
      addMessage('Could Not Sync');
    }
  })
  .catch(err => {
    console.error(err);
    addMessage('Could not connect');
  });
}

export function saveAndCloseEditModalAndSync() {
  saveEditModalAndSync().then(() => {
    document.getElementById('editModal').style.display = 'none';
  });
}