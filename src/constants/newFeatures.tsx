import _ from "lodash";

type NewFeature = {
  featureValue: number;
  title: string;
  summary: React.ReactNode;
  content: React.ReactNode;
};

export const NEW_FEATURES: NewFeature[] = [
  {
    featureValue: 1,
    title: "New Feature",
    summary: "Check out our newest feature.",
    content: (
      <>
        <div className="bg-mcf-iconGrey w-[500px] h-[250px]" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec risus dui, interdum quis lacus sed, ultrices pharetra risus. Sed efficitur,
          risus et interdum placerat, dolor sem elementum orci, vel ullamcorper lorem dui vel dolor. Nullam vehicula ac orci eget rhoncus. Curabitur
          viverra porttitor sem, id vehicula nulla pulvinar pretium. Morbi euismod velit justo, accumsan dictum justo fermentum sit amet. Nam eu dui
          sit amet nulla hendrerit suscipit non in orci. Phasellus varius magna ultricies massa scelerisque tempor vitae vitae mi. Sed et neque in
          lorem venenatis blandit in ac ex. Curabitur porta iaculis venenatis. Integer ut tempor arcu, vitae dictum sem. Praesent vel odio ac dui
          finibus euismod iaculis a metus. Aliquam at pulvinar nisl. Vestibulum a metus massa. Aenean ullamcorper justo nulla, at rhoncus nisi
          accumsan sed. Praesent nisi risus, malesuada ut pharetra sed, maximus sed neque.
        </p>
        <div className="bg-mcf-iconGrey w-[500px] h-[250px]" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec risus dui, interdum quis lacus sed, ultrices pharetra risus. Sed efficitur,
          risus et interdum placerat, dolor sem elementum orci, vel ullamcorper lorem dui vel dolor. Nullam vehicula ac orci eget rhoncus. Curabitur
          viverra porttitor sem, id vehicula nulla pulvinar pretium. Morbi euismod velit justo, accumsan dictum justo fermentum sit amet. Nam eu dui
          sit amet nulla hendrerit suscipit non in orci. Phasellus varius magna ultricies massa scelerisque tempor vitae vitae mi. Sed et neque in
          lorem venenatis blandit in ac ex. Curabitur porta iaculis venenatis. Integer ut tempor arcu, vitae dictum sem. Praesent vel odio ac dui
          finibus euismod iaculis a metus. Aliquam at pulvinar nisl. Vestibulum a metus massa. Aenean ullamcorper justo nulla, at rhoncus nisi
          accumsan sed. Praesent nisi risus, malesuada ut pharetra sed, maximus sed neque.
        </p>
        <div className="bg-mcf-iconGrey w-[500px] h-[250px]" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec risus dui, interdum quis lacus sed, ultrices pharetra risus. Sed efficitur,
          risus et interdum placerat, dolor sem elementum orci, vel ullamcorper lorem dui vel dolor. Nullam vehicula ac orci eget rhoncus. Curabitur
          viverra porttitor sem, id vehicula nulla pulvinar pretium. Morbi euismod velit justo, accumsan dictum justo fermentum sit amet. Nam eu dui
          sit amet nulla hendrerit suscipit non in orci. Phasellus varius magna ultricies massa scelerisque tempor vitae vitae mi. Sed et neque in
          lorem venenatis blandit in ac ex. Curabitur porta iaculis venenatis. Integer ut tempor arcu, vitae dictum sem. Praesent vel odio ac dui
          finibus euismod iaculis a metus. Aliquam at pulvinar nisl. Vestibulum a metus massa. Aenean ullamcorper justo nulla, at rhoncus nisi
          accumsan sed. Praesent nisi risus, malesuada ut pharetra sed, maximus sed neque.
        </p>
        <div className="bg-mcf-iconGrey w-[500px] h-[250px]" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec risus dui, interdum quis lacus sed, ultrices pharetra risus. Sed efficitur,
          risus et interdum placerat, dolor sem elementum orci, vel ullamcorper lorem dui vel dolor. Nullam vehicula ac orci eget rhoncus. Curabitur
          viverra porttitor sem, id vehicula nulla pulvinar pretium. Morbi euismod velit justo, accumsan dictum justo fermentum sit amet. Nam eu dui
          sit amet nulla hendrerit suscipit non in orci. Phasellus varius magna ultricies massa scelerisque tempor vitae vitae mi. Sed et neque in
          lorem venenatis blandit in ac ex. Curabitur porta iaculis venenatis. Integer ut tempor arcu, vitae dictum sem. Praesent vel odio ac dui
          finibus euismod iaculis a metus. Aliquam at pulvinar nisl. Vestibulum a metus massa. Aenean ullamcorper justo nulla, at rhoncus nisi
          accumsan sed. Praesent nisi risus, malesuada ut pharetra sed, maximus sed neque.
        </p>
      </>
    ),
  },
];

export const LATEST_FEATURE = _.orderBy(NEW_FEATURES, "featureValue", "desc")[0];
