import type { NextPage } from "next";
import { Button, Textarea, Text, Loader, Title } from "@mantine/core";
import { createRef, RefObject, useRef, useState } from "react";
import {
  HiClipboardCopy,
  HiPaperAirplane,
  HiXCircle,
  HiArrowDown,
} from "react-icons/hi";
import Head from "next/head";

const Home: NextPage = () => {
  const [text, setText] = useState("");
  const [editingList, setEditingList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fixList = [
    "デザイン調整",
    "追加時に下にスクロールさせたい",
    "改行を引き継ぐ",
    "ボタンにツールチップ",
    "グレー座布団ホバーでボタンを表示したい",
    "履歴の全削除いるかな？",
    "コンポーネント化したい",
    "range.selectNodeContentsの型なんとかしたい",
  ];

  const handleEditing = (sendText: string) => {
    setLoading(true);
    fetch(
      `https://api-free.deepl.com/v2/translate?auth_key=${process.env.NEXT_PUBLIC_AUTH_KEY}&text=${sendText}&target_lang=en`
    )
      .then((res) => res.json())
      .then((res) => {
        fetch(
          `https://api-free.deepl.com/v2/translate?auth_key=${process.env.NEXT_PUBLIC_AUTH_KEY}&text=${res.translations[0].text}&target_lang=ja`
        )
          .then((res) => res.json())
          .then((res) => {
            const array =
              sendText === editingList.slice(-1)[0]
                ? [res.translations[0].text]
                : [sendText, res.translations[0].text];

            setEditingList((prev) => [...prev, ...array]);
            setLoading(false);
          });
      });
  };

  const refFooter = useRef<HTMLElement | null>(null);
  const refs = useRef<RefObject<HTMLDivElement>[]>([]);
  editingList.forEach((_, i) => {
    refs.current[i] = createRef();
  });

  return (
    <>
      <Head>
        <title>deepl校正</title>
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
            <div className="rounded-md bg-[#f1f3f5] p-2" key={i}>
              <Text size="xs" weight="700" color="gray" ref={refs.current[i]}>
                {editingItem}
              </Text>
              <div className="grid grid-flow-col items-center justify-end">
                <Button
                  compact
                  variant="subtle"
                  onClick={() =>
                    setEditingList((prev) =>
                      prev.filter((item, index) => index !== i)
                    )
                  }
                >
                  <HiXCircle />
                </Button>
                <Button
                  compact
                  variant="subtle"
                  onClick={() => {
                    const selected = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(refs.current[i].current as Node);
                    selected?.removeAllRanges();
                    selected?.addRange(range);
                    document.execCommand("copy");
                  }}
                >
                  <HiClipboardCopy />
                </Button>
                <Button
                  compact
                  variant="subtle"
                  onClick={() => setText(editingItem)}
                >
                  <HiArrowDown />
                </Button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="grid justify-center rounded-md bg-[#f1f3f5] p-2">
              <Loader size="sm" />
            </div>
          )}

          <Text size="xs" weight="700" color="gray">
            DeepLAPIを使って日本語を英語に翻訳し、それを日本語に再翻訳することで、日本語の表現をよりきれいにすることができるかもしれないアプリ
          </Text>

          <Title order={6}>修正したいリスト</Title>

          <ul>
            {fixList.map((fixItem, i) => (
              <li key={i}>
                <Text size="xs" weight="700" color="gray">
                  ・{fixItem}
                </Text>
              </li>
            ))}
          </ul>
        </div>

        <footer
          className="fixed bottom-0 left-0 z-10 grid w-full gap-2 border-t border-gray-200 bg-white p-4"
          ref={refFooter}
        >
          <Textarea
            autosize
            variant="unstyled"
            minRows={2}
            placeholder="テキストを入力してください"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="grid grid-flow-col items-center justify-end">
            <Button compact variant="subtle" onClick={() => setText("")}>
              <HiXCircle />
            </Button>
            <Button
              compact
              variant="subtle"
              onClick={() => {
                const selected = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(
                  refFooter.current?.children[0].children[0].children[0] as Node
                );
                selected?.removeAllRanges();
                selected?.addRange(range);
                document.execCommand("copy");
              }}
            >
              <HiClipboardCopy />
            </Button>
            <Button
              className="ml-2"
              onClick={() => handleEditing(text)}
              disabled={loading}
              compact
            >
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
