import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '@/lib/urls';

async function proxyRequest(
  request: NextRequest,
  pathname: string,
  method: string,
  body?: unknown
) {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const url = buildApiUrl(pathname, queryString);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  const isCacheableGet =
    method === "GET" &&
    !pathname.includes("cart") &&
    !pathname.includes("order") &&
    !pathname.includes("users");

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      ...(isCacheableGet
        ? { next: { revalidate: 60 } }
        : { cache: "no-store" as const }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join('/'), 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await request.json();
  return proxyRequest(request, path.join('/'), 'POST', body);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await request.json();
  return proxyRequest(request, path.join('/'), 'PUT', body);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join('/'), 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await request.json();
  return proxyRequest(request, path.join('/'), 'PATCH', body);
}
