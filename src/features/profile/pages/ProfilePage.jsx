import { useSelector, useDispatch } from "react-redux";
import { startEditing } from "../store/profileSlice";
import { useProfileForm } from "../hooks/useProfileForm";
import ProfileSkeleton from "../components/ProfileSkeleton";
import ProfileHeader from "../components/ProfileHeader";
import ProfileImageCard from "../components/ProfileImageCard";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { isEditing } = useSelector(state => state.profile);
  const {
    profile,
    isLoading,
    isSaving,
    form,
    imagePreview,
    fileInputRef,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleCancel,
  } = useProfileForm(isEditing);

  if (isLoading) return <ProfileSkeleton />;

  return (
    <section className="w-full min-w-0 space-y-6">
      <ProfileHeader
        isEditing={isEditing}
        onEdit={() => dispatch(startEditing())}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ProfileImageCard
          profile={profile}
          imagePreview={imagePreview}
          isEditing={isEditing}
          isSaving={isSaving}
          fileInputRef={fileInputRef}
          onImageChange={handleImageChange}
        />

        <div className="lg:col-span-2 h-full">
          <ProfileForm
            form={form}
            isEditing={isEditing}
            isSaving={isSaving}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;