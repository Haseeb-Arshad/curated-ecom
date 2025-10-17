import { type LoaderFunctionArgs } from '@react-router/node';
import fs from 'fs';
import path from 'path';

export async function loader({ request }: LoaderFunctionArgs) {
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  
  try {
    const swContent = fs.readFileSync(swPath, 'utf-8');
    
    return new Response(swContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return new Response('Service worker not found', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}