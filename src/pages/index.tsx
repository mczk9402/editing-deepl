import type { NextPage } from "next";
import {
  Button,
  Textarea,
  Card,
  Text,
  useMantineTheme,
  Loader,
  Title,
} from "@mantine/core";
import { useRef, useState } from "react";
import { HiClipboardCopy, HiPaperAirplane, HiXCircle } from "react-icons/hi";
import Head from "next/head";

const Home: NextPage = () => {
  const [text, setText] = useState("");
  const [editingList, setEditingList] = useState<
    { input: string; editing: string; time: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fixList = ["iosでコピペがうまくいかない", "デザイン調整"];

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
            const date = new Date();
            setEditingList((prev) => {
              return [
                ...prev,
                {
                  input: sendText,
                  editing: res.translations[0].text,
                  time:
                    date.getHours().toString() +
                    ":" +
                    date.getMinutes().toString() +
                    ":" +
                    date.getSeconds().toString(),
                },
              ];
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
            <Card className="grid gap-2" shadow="sm" p="lg" key={i}>
              <div className="flex items-center justify-between">
                {editingItem.time}
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
              </div>
              <Text size="xs" weight="700" color="gray">
                before
              </Text>
              <div className="rounded-md bg-[#f1f3f5] p-2">
                <Textarea
                  autosize
                  minRows={2}
                  value={editingItem.input}
                  variant="unstyled"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditingList((prev) => {
                      return prev.map((item, index) => {
                        if (index === i) {
                          return {
                            input: e.target.value,
                            editing: item.editing,
                            time: item.time,
                          };
                        }
                        return item;
                      });
                    })
                  }
                />
                <div className="grid grid-flow-col items-center justify-end">
                  <Button
                    compact
                    variant="subtle"
                    onClick={() => navigator.clipboard.writeText(text)}
                  >
                    <HiClipboardCopy />
                  </Button>
                  <Button
                    onClick={() => handleEditing(editingItem.input)}
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
              </div>
              <Text size="xs" weight="700" color="gray">
                after
              </Text>
              <div className="rounded-md bg-[#f1f3f5] p-2">
                <Textarea
                  autosize
                  minRows={2}
                  value={editingItem.editing}
                  variant="unstyled"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditingList((prev) => {
                      return prev.map((item, index) => {
                        if (index === i) {
                          return {
                            input: item.input,
                            editing: e.target.value,
                            time: item.time,
                          };
                        }
                        return item;
                      });
                    })
                  }
                />
                <div className="grid grid-flow-col items-center justify-end">
                  <Button
                    compact
                    variant="subtle"
                    onClick={() => navigator.clipboard.writeText(text)}
                  >
                    <HiClipboardCopy />
                  </Button>
                  <Button
                    onClick={() => handleEditing(editingItem.editing)}
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
              </div>
            </Card>
          ))}

          <Title order={5}>修正したいリスト</Title>
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
            placeholder="テキストを書く"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="grid grid-flow-col items-center justify-end">
            <Button
              compact
              variant="subtle"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              <HiClipboardCopy />
            </Button>
            <Button
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
