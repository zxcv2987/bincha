import { NextRequest, NextResponse } from "next/server";
import { authenticateAndIssueTokens } from "@/lib/auth/login";
import { AuthError, getStatusForAuthError } from "@/lib/auth/errors";
import { setAuthTokensOnResponse } from "@/lib/auth/response-cookies";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const tokens = await authenticateAndIssueTokens(password);

    const response = NextResponse.json({ success: true });
    setAuthTokensOnResponse(response, tokens);
    return response;
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { message: err.message },
        { status: getStatusForAuthError(err.code) },
      );
    }
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
