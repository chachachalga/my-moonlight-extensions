import type { GifFavorite } from "@moonlight-mod/wp/gifSorter_types";

export interface GifFolder {
  name: string;
  gifs: string[];
}

export interface GifFolderStorage {
  folders: Record<string, GifFolder>;
  folderOrder: string[];
  selectedFolder: string;
}

const DEFAULT_STORAGE = {
  folders: {},
  folderOrder: [],
  selectedFolder: "all"
};

const STORAGE_KEY = "gifFolders";

export function getStorage(): GifFolderStorage {
  const raw = moonlight.localStorage.getItem(STORAGE_KEY);
  const myData = raw ? JSON.parse(raw) : null;

  if (!myData) {
    return DEFAULT_STORAGE;
  } else {
    return { ...DEFAULT_STORAGE, ...myData }; // merge in case i ever change smt
  }
}

export function saveStorage(data: GifFolderStorage): void {
  moonlight.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getFolders(): Record<string, GifFolder> {
  return getStorage().folders;
}

export function createFolder(folderName: string): void {
  const storage = getStorage();
  const newId = self.crypto.randomUUID();

  storage.folders = {
    ...storage.folders,
    [newId]: { name: folderName, gifs: [] }
  };

  storage.folderOrder.push(newId);

  saveStorage(storage);
}

export function deleteFolder(id: string): void {
  const storage = getStorage();
  delete storage.folders[id];
  storage.folderOrder = storage.folderOrder.filter((folderId) => folderId !== id);
  storage.selectedFolder = "all"; // no need for if case, cause you can only delete the folder if you have it selected
  saveStorage(storage);
}

// what if name empty? or too long? add limits?
export function renameFolder(id: string, newName: string): void {
  const storage = getStorage();
  storage.folders[id].name = newName;
  saveStorage(storage);
}

export function addGifToFolder(id: string, gifUrl: string): void {
  const storage = getStorage();
  storage.folders[id].gifs.push(gifUrl);
  saveStorage(storage);
}

export function removeGifFromFolder(id: string, gifUrl: string) {
  const storage = getStorage();
  storage.folders[id].gifs = storage.folders[id].gifs.filter((url) => url !== gifUrl);
  saveStorage(storage);
}

export function filterByFolder(favorites: GifFavorite[]): GifFavorite[] {
  const storage = getStorage();
  if (storage.selectedFolder === "all") return favorites;
  const folder = storage.folders[storage.selectedFolder];
  if (!folder) return favorites; // safety fallback
  return favorites.filter((gif) => folder.gifs.includes(gif.url));
}

export function setSelectedFolder(id: string): void {
  const storage = getStorage();
  storage.selectedFolder = id;
  saveStorage(storage);
}
