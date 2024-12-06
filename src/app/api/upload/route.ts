// import { NextResponse } from 'next/server';
// import { ImgBBResponse } from '@/lib/interfaces/interfaces';

// export const runtime = 'edge';

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const image = formData.get('image') as File;

//     if (!image) {
//       return NextResponse.json({ error: 'No image provided' }, { status: 400 });
//     }

//     // Convert image to base64
//     const bytes = await image.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const base64Image = buffer.toString('base64');

//     // Create form data for ImgBB
//     const imgbbFormData = new FormData();
//     imgbbFormData.append('image', base64Image);

//     // Upload to ImgBB
//     const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
//       method: 'POST',
//       body: imgbbFormData,
//     });

//     const data = await response.json() as ImgBBResponse;

//     if (!data.success) {
//       throw new Error(data.error?.message || 'Failed to upload image');
//     }

//     // Return the direct image URL instead of the page URL
//     const directImageUrl = data.data.url.replace(/\.com\//, '.com/i/');
//     return NextResponse.json({ url: directImageUrl });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return NextResponse.json(
//       { error: 'Failed to upload image' },
//       { status: 500 }
//     );
//   }
// } 