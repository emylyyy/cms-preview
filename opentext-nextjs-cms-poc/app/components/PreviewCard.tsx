import React from 'react';
export default function PreviewCard({ data }: { data: any }) {
  if (!data) return null;
  const title = data.title || data.headline || data.name || data.Title;
  const body = data.body || data.description || data.content || data.Body;
  const image = data.imageUrl || data.image || data.heroImage || data.Image;
  if (!title && !body && !image) return <div className="text-slate-500 italic p-4">Unable to auto-render preview from JSON structure.</div>;
  return (
    <div className="bg-white text-slate-900 rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto mt-4">
      {image && <div className="h-48 w-full bg-slate-200 relative"><img src={image} alt="Preview" className="w-full h-full object-cover" /></div>}
      <div className="p-6">
        {title && <h1 className="text-3xl font-bold mb-4">{title}</h1>}
        {body && <div className="prose prose-slate" dangerouslySetInnerHTML={{ __html: body }} />}
      </div>
    </div>
  );
}