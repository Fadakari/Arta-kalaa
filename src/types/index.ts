export interface ImageType {
    id: number;
    image: string;
    alt: string;
    link?: string;
    order?: number;
  }
  
  export interface SliderImage {
    id: number;
    src: string;
    alt: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    icon?: string;
    slug?: string;
  }
  
  export interface BlogCategory {
    id: number;
    title: string;
    slug: string;
  }
  
  export interface Feature {
    img: string;
    title: string;
    desc: string;
  }
  
  export interface Brand {
    name: string;
    image: string;
  }