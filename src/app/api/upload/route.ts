import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (
      file.size > 5 * 1024 * 1024 ||
      !["image/png", "image/jpeg"].includes(file.type)
    )
      return NextResponse.json(
        { error: "Choose a PNG or JPG under 5MB." },
        { status: 400 },
      );
    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      return NextResponse.json(
        {
          error:
            "Image storage is not configured. Add PINATA_JWT to the deployment.",
        },
        { status: 500 },
      );
    }

    // Upload file to Pinata IPFS
    const pinataForm = new FormData();
    pinataForm.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: pinataForm,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Pinata upload error:", err);
      return NextResponse.json(
        { error: "Failed to upload to IPFS" },
        { status: 500 },
      );
    }

    const data = await res.json();
    const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";

    return NextResponse.json({
      url: `https://${gateway}/ipfs/${data.IpfsHash}`,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
