import { CameraAlt } from "@mui/icons-material";

const ProfileImageCard = ({ profile, imagePreview, isEditing, isSaving, fileInputRef, onImageChange }) => (
  <div className="lg:col-span-1 h-full">
    <div className="rounded-3xl border theme-border theme-surface p-6 shadow-sm text-center h-full flex flex-col justify-center">
      <div className="relative mx-auto w-40 h-40">
        <img
          src={
            imagePreview ||
            `https://ui-avatars.com/api/?name=${profile?.name || "U"}&size=160&background=0AB3BA&color=fff`
          }
          alt="صورة المستخدم"
          className="w-full h-full rounded-full object-cover border-4 theme-border shadow-md"
        />
        {isEditing && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={isSaving}
              className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <CameraAlt fontSize="small" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </>
        )}
      </div>
      <h2 className="mt-4 text-xl font-bold theme-text">{profile?.name}</h2>
      <p className="text-sm theme-text-muted">{profile?.email}</p>
    </div>
  </div>
);

export default ProfileImageCard;