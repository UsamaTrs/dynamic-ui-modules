export interface Module {
  _id?: number | string;
  title: string;
  avatar: string;
  bgColor: string;
  fontColor: string;
  icon:string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ScreenSettings {
  _id?: string;
  bgColor: string;
  fontColor: string;
  fontFamily: string;
  headings: {
    line1: string;
    line2: string;
  };
  text: string;
}
