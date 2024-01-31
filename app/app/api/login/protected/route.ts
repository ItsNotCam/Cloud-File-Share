import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {

  try {
    const headersInstance = headers();
    const authHeader = headersInstance.get("authorization");

		if(authHeader === null)
			return NextResponse.json({message: "no auth header"}, {status: 400})

    const token = authHeader.split(" ")[1];

    const decoded: jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET || "ok") as jwt.JwtPayload
    if (!decoded) {
      return NextResponse.json(
        { message: "Expired" },
        { status: 400, }
      );
    } else if ((decoded.exp || -1) < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { message: "Expired" },
        { status: 400, }
      );
    } else {
      // If the token is valid, return some protected data.
      return NextResponse.json(
        { data: "Protected data" },
        { status: 200, }
      );
    }
  } catch (error) {
    console.error("Token verification failed", error);
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 400, }
    );
  }
}