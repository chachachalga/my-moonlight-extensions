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

// const LEGACY_KEY = "gifFolders";
const EXT_ID = "gifSorter";
const CONFIG_KEY = "gifFolders";

const DEFAULT_STORAGE = {
  folders: {},
  folderOrder: [],
  selectedFolder: "all"
};

export function getStorage(): GifFolderStorage {
  // // import data from legacy localStorage
  // const legacy = moonlight.localStorage.getItem(LEGACY_KEY);
  // if (legacy) {
  //   const parsed: GifFolderStorage = { ...DEFAULT_STORAGE, ...JSON.parse(legacy) };
  //   moonlight.setConfigOption<GifFolderStorage>(EXT_ID, CONFIG_KEY, parsed); // fire-and-forget is fine here
  //   moonlight.localStorage.removeItem(LEGACY_KEY);
  //   return parsed;
  // }
  const saved = moonlight.getConfigOption<GifFolderStorage>(EXT_ID, CONFIG_KEY);
  return saved ? { ...DEFAULT_STORAGE, ...saved } : DEFAULT_STORAGE;
}

export async function saveStorage(data: GifFolderStorage): Promise<void> {
  await moonlight.setConfigOption<GifFolderStorage>(EXT_ID, CONFIG_KEY, data);
}

export function getFolders(): Record<string, GifFolder> {
  return getStorage().folders;
}

export async function createFolder(folderName: string): Promise<void> {
  const storage = getStorage();
  const newId = self.crypto.randomUUID();
  storage.folders = { ...storage.folders, [newId]: { name: folderName, gifs: [] } };
  storage.folderOrder.push(newId);
  await saveStorage(storage);
}

export async function deleteFolder(id: string): Promise<void> {
  const storage = getStorage();
  delete storage.folders[id];
  storage.folderOrder = storage.folderOrder.filter((folderId) => folderId !== id);
  storage.selectedFolder = "all";
  await saveStorage(storage);
}

export async function renameFolder(id: string, newName: string): Promise<void> {
  const storage = getStorage();
  storage.folders[id].name = newName;
  await saveStorage(storage);
}

export async function addGifToFolder(id: string, gifUrl: string): Promise<void> {
  const storage = getStorage();
  storage.folders[id].gifs.push(gifUrl);
  await saveStorage(storage);
}

export async function removeGifFromFolder(id: string, gifUrl: string) {
  const storage = getStorage();
  storage.folders[id].gifs = storage.folders[id].gifs.filter((url) => url !== gifUrl);
  await saveStorage(storage);
}

export function filterByFolder(favorites: GifFavorite[]): GifFavorite[] {
  const storage = getStorage();
  if (storage.selectedFolder === "all") return favorites;
  const folder = storage.folders[storage.selectedFolder];
  if (!folder) return favorites; // safety fallback
  return favorites.filter((gif) => folder.gifs.includes(gif.url));
}

export async function setSelectedFolder(id: string): Promise<void> {
  const storage = getStorage();
  storage.selectedFolder = id;
  await saveStorage(storage);
}
