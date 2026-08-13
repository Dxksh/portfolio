export interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

// PROVISIONAL — empty until real photos are added to public/photos/.
// The Photos section renders a friendly empty state while this is empty.
export const photos: Photo[] = [];
