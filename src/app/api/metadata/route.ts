import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { metadata, mint } = await request.json();

    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      return NextResponse.json({ error: "Pinata not configured" }, { status: 500 });
    }

    // Upload metadata JSON to Pinata IPFS
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${mint}.json`,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Pinata metadata error:", err);
      return NextResponse.json({ error: "Failed to upload metadata to IPFS" }, { status: 500 });
    }

    const data = await res.json();
    const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";

    return NextResponse.json({
      uri: `https://${gateway}/ipfs/${data.IpfsHash}`,
    });
  } catch (error: unknown) {
    console.error("Metadata error:", error);
    return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 });
  }
}
