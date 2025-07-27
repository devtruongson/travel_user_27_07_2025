'use client';

import { useState } from 'react';
import BookingModal from './BookingModal';
import { Button } from '@/components/ui/button';

export default function BookTourButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="text-black">Đặt ngay</Button>
      <BookingModal slug={slug} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
