// Healthcheck cho Docker / CD: chỉ kiểm tra web server còn sống, không gọi backend
export const dynamic = "force-dynamic";

export function GET() {
    return Response.json({ status: "ok" });
}
