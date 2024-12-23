import QRCode from 'qrcode';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const qrcodeId = searchParams.get('qrcodeId');

    // ตรวจสอบว่ามี qrcodeId หรือไม่
    if (!qrcodeId || typeof qrcodeId !== 'string') {
      return new Response('Invalid QR Code ID', { status: 400 });
    }

    // ดึง type จาก qrcodeId (ตัวอักษร 2 ตัวหลังจากตัวเลข 4 ตัวแรก)
    // เช่น 0002PP00014 จะได้ type = PP
    const type = qrcodeId.substring(4, 6);
    
    if (!type) {
      return new Response('Cannot extract type from QR Code ID', { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const traceUrl = new URL(`/trace/traceback`, baseUrl);
    traceUrl.searchParams.set('code', qrcodeId);
    traceUrl.searchParams.set('type', type);

    const qrOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300,
    };

    const qrCodeBuffer = await QRCode.toBuffer(traceUrl.toString(), qrOptions);

    return new Response(qrCodeBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="qrcode-${encodeURIComponent(qrcodeId)}.png"`,
        'Cache-Control': 'public, max-age=3600',
        'Content-Length': qrCodeBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate QR code',
        message: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}