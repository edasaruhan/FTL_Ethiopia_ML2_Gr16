import { NextResponse } from 'next/server'
import api from '@/lib/api'

export async function POST(request) {
  const { email, password } = await request.json()
  try {
    const response = await api.post('/auth/login/', { email, password })
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { error: error.response.data },
      { status: error.response.status }
    )
  }
}