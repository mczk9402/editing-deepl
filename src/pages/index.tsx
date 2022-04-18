import type { NextPage } from "next";
import { Button, Textarea } from "@mantine/core";
import { useState } from "react";
import { HiClipboardCopy, HiArrowDown, HiPaperAirplane } from "react-icons/hi";

const Home: NextPage = () => {
  const [text, setText] = useState("");
  const [editingList, setEditingList] = useState<string[]>([]);

  const handleClick = () => {
    fetch(
      `https://api-free.deepl.com/v2/translate?auth_key=${process.env.NEXT_PUBLIC_AUTH_KEY}&text=${text}&target_lang=en`
    )
      .then((res) => res.json())
      .then((res) => {
        fetch(
          `https://api-free.deepl.com/v2/translate?auth_key=${process.env.NEXT_PUBLIC_AUTH_KEY}&text=${res.translations[0].text}&target_lang=ja`
        )
          .then((res) => res.json())
          .then((res) =>
            setEditingList((prev) => [...prev, res.translations[0].text])
          );
      });
  };

  return (
    <div className="p-4">
      {editingList.map((editingItem, i) => (
        <div key={i}>
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
          <span>{editingItem}</span>
        </div>
      ))}
      <Textarea
        autosize
        minRows={2}
        placeholder="テキストを書く"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-flow-col justify-end">
        <Button
          compact
          variant="subtle"
          onClick={() => navigator.clipboard.writeText(text)}
        >
          <HiClipboardCopy />
        </Button>
        <Button onClick={handleClick} compact>
          <HiPaperAirplane />
        </Button>
      </div>
    </div>
  );
};

export default Home;
