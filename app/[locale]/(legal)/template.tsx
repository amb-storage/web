import LegalContentTransition from "./_components/LegalContentTransition/LegalContentTransition";

// template.tsx mount lại mỗi lần đổi trang trong nhóm (legal) -> dùng để fade nội dung mới vào
export default function LegalTemplate({ children }: { children: React.ReactNode }) {
  return <LegalContentTransition>{children}</LegalContentTransition>;
}
