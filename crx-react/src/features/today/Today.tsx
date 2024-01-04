import { ConvoListItem } from "../convos/ConvoList";
import { Convo } from "../convos/useConvos";
import { Tag } from "../user/currentUser";

type Props = {
  convos: Convo[];
  tags: Tag[];
};

export const Today = ({ convos, tags }: Props) => {
  return (
    <>
      {convos.map((c) => (
        <ConvoListItem convo={c} allTags={tags} />
      ))}
    </>
  );
};
