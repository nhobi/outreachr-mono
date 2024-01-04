import { Field, Form, Formik, ErrorMessage, FormikHelpers } from "formik";
import { Tag, useCurrentUser } from "../user/currentUser";
import { updateCollectionItem } from "../../utils/updateCollectionItem";
import { randomString } from "../../utils/randomString";
import * as Yup from "yup";
import { getFirstEmoji } from "../../utils/emojiRegex";
import { PartialBy } from "../../utils/types";

type TagStub = PartialBy<Tag, "id">;
type Props = {
  tag: TagStub;
  onClose: () => void;
};

export const TagForm = ({ tag, onClose }: Props) => {
  const cu = useCurrentUser();

  if (!cu) {
    return null;
  }

  const { userMutation, tags } = cu;

  const handleSubmit = (
    updatedTag: TagStub,
    actions: FormikHelpers<TagStub>,
  ) => {
    updatedTag.emoji = getFirstEmoji(updatedTag.emoji);
    actions.setValues(updatedTag);
    if (updatedTag.id) {
      const newTags = updateCollectionItem(tags, updatedTag as Tag);

      userMutation.mutate({
        tags: newTags,
      });
    } else {
      userMutation.mutate({
        tags: [...tags, { ...updatedTag, id: randomString(5) }],
      });
    }

    onClose();
  };
  const isExistingTag = !!tag.id;
  const TagSchema = Yup.object().shape({
    label: Yup.string()
      .min(3, "Must be at least 3 characters.")
      .required("Label is required."),
    emoji: Yup.string().required("Single emoji is required."),
    remindMeDays: Yup.number()
      .min(1, "Between 1-365")
      .max(365, "Between 1-365"),
  });

  const renderErrorMsg = (key: string) => (
    <ErrorMessage
      name={key}
      render={(msg) => <span className="text-red-600 block mt-1">{msg}</span>}
    />
  );

  const handleDelete = () => {
    const isConfirmed = confirm(
      "This cannot be undone. Convos will not automatically be retagged if you try to recreate this deleted tag. Continue?",
    );

    if (isConfirmed && isExistingTag) {
      userMutation.mutate({
        tags: tags.filter((t) => t.id !== tag.id),
      });
      close();
    }
  };

  return (
    <>
      <h1 className="flex justify-between text-sm font-bold text-slate-800 pt-6">
        <span>{isExistingTag ? "Update Tag" : "Create New Tag"}</span>
        <button onClick={onClose}>&times;</button>
      </h1>
      <Formik<TagStub>
        initialValues={tag}
        onSubmit={handleSubmit}
        validationSchema={TagSchema}
      >
        <Form className="flex flex-col justify-start gap-y-2">
          <label className="block">
            Label
            <Field
              name="label"
              placeholder="Tag label"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 form-input"
            />
            {renderErrorMsg("label")}
          </label>

          <label className="block">
            Emoji
            <Field
              name="emoji"
              type="text"
              placeholder="Emoji"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 form-input"
            />
            {renderErrorMsg("emoji")}
          </label>
          <label className="block">
            Remind me after # of days
            <Field
              name="remindMeDays"
              type="number"
              placeholder="Remind me after # days"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 form-input"
            />
            {renderErrorMsg("remindMeDays")}
          </label>
          <i className="text-xs">
            When you add this tag to a convo, they'll added to your "today" tab
            this many days after your last interaction.
          </i>
          <button
            type="submit"
            disabled={userMutation.isPending}
            className="px-4 py-2 mt-5 font-lg font-semibold bg-cyan-500 text-white rounded-full shadow-sm opacity-100 disabled:opacity-75"
          >
            {userMutation.isPending ? "Saving..." : "Save"}
          </button>
        </Form>
      </Formik>
      {isExistingTag && (
        <div className="mt-5 flex justify-center">
          <button onClick={handleDelete} className="text-red-600 text-center">
            Delete Tag
          </button>
        </div>
      )}
    </>
  );
};
