import React from "@moonlight-mod/wp/react";
import * as storageModule from "@moonlight-mod/wp/gifSorter_storage";

const backgroundColor = "#393a41";
const menuColor = "#2c2d32";
const primaryTextColor = "#dbdee1";
const secondaryTextColor = "#7d7d84";
const warningColor = "#f23f43";
const highlightColor = "#5865f2";
const outlineColor = "#1e1f22";

const FOLDER_NAME_MAX_LENGTH = 16;

function FolderBar({ gifPickerThis }: { gifPickerThis: any }) {
  const storage = storageModule.getStorage();
  const [creating, setCreating] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [renaming, setRenaming] = React.useState(false);
  const [renameName, setRenameName] = React.useState("");

  const selectedFolder = storage.selectedFolder;
  const isFolderSelected = selectedFolder !== "all";

  const inputStyle = {
    background: menuColor,
    border: `1px solid ${outlineColor}`,
    borderRadius: "6px",
    color: primaryTextColor,
    fontSize: "14px",
    padding: "5px 8px",
    width: "120px",
    outline: "none",
    flexShrink: 0
  };

  const actionBtnStyle = (variant: "default" | "danger" = "default") => ({
    background: variant === "danger" ? warningColor : menuColor,
    border: `1px solid ${variant === "danger" ? warningColor : outlineColor}`,
    borderRadius: "6px",
    color: variant === "danger" ? "#ffffff" : primaryTextColor,
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: "0",
    lineHeight: "1"
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "6px 8px",
        flexShrink: 0,
        background: backgroundColor
      }}
    >
      <style>{`
        .gss-input::placeholder { color: ${secondaryTextColor}; }
        .gss-scroll::-webkit-scrollbar { display: none; }
        .gss-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Scrollable tabs area: takes all leftover space, clips its own scrollbar */}
      <div
        className="gss-scroll"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "6px",
          overflowX: "auto",
          flex: 1,
          minWidth: 0
        }}
      >
        {/* "All" tab */}
        <button
          onClick={async () => {
            storageModule.setSelectedFolder("all");
            gifPickerThis.forceUpdate();
          }}
          style={{
            background: selectedFolder === "all" ? highlightColor : menuColor,
            border: `1px solid ${outlineColor}`,
            borderRadius: "6px",
            color: primaryTextColor,
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: selectedFolder === "all" ? "600" : "normal",
            padding: "5px 12px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            height: "30px"
          }}
        >
          All
        </button>

        {/* Folder tabs */}
        {storage.folderOrder.map((id: string) => (
          <button
            key={id}
            onClick={async () => {
              storageModule.setSelectedFolder(id);
              gifPickerThis.forceUpdate();
            }}
            style={{
              background: selectedFolder === id ? highlightColor : menuColor,
              border: `1px solid ${outlineColor}`,
              borderRadius: "6px",
              color: primaryTextColor,
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: selectedFolder === id ? "600" : "normal",
              padding: "5px 12px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              height: "30px"
            }}
          >
            {storage.folders[id].name}
          </button>
        ))}

        {/* New folder name input */}
        {creating && (
          <input
            autoFocus
            className="gss-input"
            value={newFolderName}
            maxLength={FOLDER_NAME_MAX_LENGTH}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && newFolderName.trim().length > 0) {
                await storageModule.createFolder(newFolderName.trim());
                setNewFolderName("");
                setCreating(false);
                gifPickerThis.forceUpdate();
              }
              if (e.key === "Escape") {
                setNewFolderName("");
                setCreating(false);
              }
            }}
            placeholder="Folder name..."
            style={inputStyle}
          />
        )}

        {/* Rename folder input */}
        {renaming && isFolderSelected && (
          <input
            autoFocus
            className="gss-input"
            value={renameName}
            maxLength={FOLDER_NAME_MAX_LENGTH}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && renameName.trim().length > 0) {
                await storageModule.renameFolder(selectedFolder, renameName.trim());
                setRenameName("");
                setRenaming(false);
                gifPickerThis.forceUpdate();
              }
              if (e.key === "Escape") {
                setRenameName("");
                setRenaming(false);
              }
            }}
            placeholder="New name..."
            style={inputStyle}
          />
        )}
      </div>

      {/* Thin divider separating scroll area from fixed buttons */}
      <div style={{ width: "1px", height: "20px", background: outlineColor, margin: "0 8px", flexShrink: 0 }} />

      {/* Action buttons: anchored outside the scroll area, always visible */}
      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        {!creating && (
          <button
            onClick={() => {
              setRenaming(false);
              setCreating(true);
            }}
            style={actionBtnStyle()}
          >
            +
          </button>
        )}
        {isFolderSelected && !renaming && (
          <button
            onClick={() => {
              setRenameName(storage.folders[selectedFolder].name);
              setCreating(false);
              setRenaming(true);
            }}
            style={actionBtnStyle()}
          >
            ✎
          </button>
        )}
        {isFolderSelected && (
          <button
            onClick={async () => {
              await storageModule.deleteFolder(selectedFolder);
              gifPickerThis.forceUpdate();
            }}
            style={actionBtnStyle("danger")}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export function wrapContent(gifPickerThis: any, component: any) {
  const isFavorites = gifPickerThis.state.resultType === "Favorites";

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      {isFavorites && <FolderBar gifPickerThis={gifPickerThis} />}
      {component}
    </div>
  );
}

function GifOverlay({ item }: { item: any }) {
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const storage = storageModule.getStorage();
  const selectedFolder = storage.selectedFolder;
  const isInCurrentFolder = selectedFolder !== "all" && storage.folders[selectedFolder]?.gifs.includes(item.url);

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          if (!open) setHovered(false);
        }}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />
      {(hovered || open) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            if (!open) setHovered(false);
          }}
          style={{
            position: "absolute",
            bottom: "6px",
            left: "6px",
            background: menuColor,
            border: `1px solid ${outlineColor}`,
            borderRadius: "4px",
            cursor: "pointer",
            padding: "2px 7px",
            zIndex: 2,
            color: primaryTextColor,
            fontSize: "18px",
            fontWeight: "bold",
            lineHeight: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          +
        </div>
      )}
      {open && (
        <div
          onMouseLeave={() => {
            setHovered(false);
            setOpen(false);
          }}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            background: menuColor,
            border: `1px solid ${outlineColor}`,
            borderRadius: "8px",
            padding: "4px",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            minWidth: "140px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.6)"
          }}
        >
          {storage.folderOrder.length === 0 && (
            <div style={{ color: secondaryTextColor, padding: "6px 8px", fontSize: "14px" }}>No folders yet</div>
          )}
          {storage.folderOrder.map((id: string) => (
            <div
              key={id}
              onClick={async (e) => {
                e.stopPropagation();
                await storageModule.addGifToFolder(id, item.url);
                setOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#35373c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              style={{
                padding: "6px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                color: primaryTextColor,
                fontSize: "14px"
              }}
            >
              {storage.folders[id].name}
            </div>
          ))}
          {isInCurrentFolder && (
            <>
              <div style={{ height: "1px", background: outlineColor, margin: "4px 0" }} />
              <div
                onClick={async (e) => {
                  e.stopPropagation();
                  await storageModule.removeGifFromFolder(selectedFolder, item.url);
                  setOpen(false);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#35373c")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{
                  padding: "6px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: warningColor,
                  fontSize: "14px"
                }}
              >
                Remove from folder
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export function renderGifExtras(item: any, original: any) {
  return (
    <>
      {original}
      <GifOverlay item={item} />
    </>
  );
}
