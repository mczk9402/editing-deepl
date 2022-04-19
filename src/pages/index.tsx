import type { NextPage } from "next";
import {
  Button,
  Textarea,
  Card,
  Text,
  useMantineTheme,
  Loader,
} from "@mantine/core";
import { useRef, useState } from "react";
import { HiClipboardCopy, HiArrowDown, HiPaperAirplane } from "react-icons/hi";
import Head from "next/head";

const Home: NextPage = () => {
  const [text, setText] = useState("");
  const [editingList, setEditingList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleEditing = () => {
    setLoading(true);
    fetch(
      `https://api-free.deepl.com/v2/translate?auth_key=${process.env.NEXT_PUBLIC_AUTH_KEY}&text=${text}&target_lang=en`
    )
      .then((res) => res.json())
      .then((res) => {
        fetch(
          `https://api-free.deepl.com/v2/translate?auth_key=${process.env.NEXT_PUBLIC_AUTH_KEY}&text=${res.translations[0].text}&target_lang=ja`
        )
          .then((res) => res.json())
          .then((res) => {
            setEditingList((prev) => {
              if (prev.length === 0) {
                return [...prev, text, res.translations[0].text];
              }
              return [...prev, res.translations[0].text];
            });
            setLoading(false);
          });
      });
  };

  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const refFooter = useRef<HTMLElement | null>(null);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
        />
      </Head>
      <div
        className="min-h-full p-4"
        style={{ marginBottom: refFooter?.current?.clientHeight + "px" }}
      >
        <div className="grid gap-2">
          {editingList.map((editingItem, i) => (
            <Card className="grid gap-2" shadow="sm" p="lg" key={i}>
              <div className="grid grid-flow-col justify-end">
                <Button
                  compact
                  variant="subtle"
                  onClick={() => {
                    setText(editingList[i]);
                  }}
                >
                  <HiArrowDown />
                </Button>
                <Button
                  compact
                  variant="subtle"
                  onClick={() => navigator.clipboard.writeText(editingList[i])}
                >
                  <HiClipboardCopy />
                </Button>
              </div>
              <Text
                size="sm"
                style={{ color: secondaryColor, lineHeight: 1.5 }}
              >
                {editingItem}
              </Text>
            </Card>
          ))}
        </div>

        <footer
          className="fixed bottom-0 left-0 z-10 grid w-full gap-2 border-t border-gray-200 bg-white p-4"
          ref={refFooter}
        >
          <Textarea
            autosize
            variant="unstyled"
            minRows={2}
            placeholder="テキストを書く"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="grid grid-flow-col items-center justify-end">
            <Text size="xs" color="gray">
              ※初回のみ入力したテキストを履歴に追加します
            </Text>
            <Button
              compact
              variant="subtle"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              <HiClipboardCopy />
            </Button>
            <Button onClick={handleEditing} disabled={loading} compact>
              <div className="grid items-center justify-items-center">
                <HiPaperAirplane
                  className={`${
                    loading ? "opacity-0" : "opacity-100"
                  } area-span-1 transition-opacity`}
                />
                <Loader
                  className={`${
                    loading ? "opacity-100" : "opacity-0"
                  } area-span-1 transition-opacity`}
                  variant="dots"
                  size="xs"
                />
              </div>
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
