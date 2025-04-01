// GET(가져오기),POST(몰래붙이기),PATCH(데이터를 업데이트),DELETE(삭제)
export async function GET() {
  return Response.json({ message: "text api end point!" });
}
