"use client";

import { useProductOptions } from "@/context/ProductContext";
import ProductType from "@/types/product";
import { RadioGroup, Radio, Tooltip } from "@heroui/react";
import { CheckIcon } from "lucide-react";
interface Props {
  product: ProductType;
}

function ColorOption({ color, selectedColor, onSelect }: any) {
  const outOfStock = color.stock === 0;
  const isSelected = selectedColor?.id === color.id;

  const normalizedColor =
    typeof color.color_code === "string"
      ? color.color_code.startsWith("#")
        ? color.color_code
        : `#${color.color_code}`
      : "#ffffff";

  const hex = normalizedColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000; // 0..255

  const iconColor = brightness > 180 ? "text-black" : "text-white";
  const borderClass = brightness > 180 ? "ring-1 ring-zinc-300" : "";

  return (
    <Tooltip
      content={outOfStock ? `${color.color_name} (ناموجود)` : color.color_name}
      showArrow
    >
      <button
        onClick={() => !outOfStock && onSelect(color)}
        disabled={outOfStock}
        className={`
          relative w-7 h-7 rounded-full flex items-center justify-center
          transition-all duration-200
          ${isSelected ? "scale-125 shadow-lg" : "scale-100"}
          ${outOfStock ? "opacity-40 !cursor-not-allowed" : "cursor-pointer"}
          ${borderClass}
        `}
        style={{ backgroundColor: normalizedColor }}
        aria-label={
          outOfStock ? `${color.color_name} ( ناموجود )` : color.color_name
        }
      >
        {isSelected && !outOfStock && (
          <CheckIcon className={`w-4 h-4 ${iconColor}`} />
        )}
      </button>
    </Tooltip>
  );
}

function MaterialOption({ material, selectedMaterial }: any) {
  const outOfStock = material.stock === 0;
  const isSelected = selectedMaterial?.id === material.id;

  return (
    <Radio
      key={material.id}
      value={String(material.id)}
      isDisabled={outOfStock}
      className={`
        px-2 py-1 border rounded-lg transition-colors flex items-center
        ${
          outOfStock
            ? "border-zinc-300 text-zinc-400 !cursor-not-allowed opacity-50"
            : isSelected
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-zinc-400 text-zinc-600 hover:bg-gray-100"
        }
      `}
    >
      {material.material_name}
      {outOfStock && " (ناموجود)"}
    </Radio>
  );
}

export default function ProductOptions({ product }: Props) {
  const {
    selectedColor,
    setSelectedColor,
    selectedMaterial,
    setSelectedMaterial,
  } = useProductOptions();

  return (
    <div className="space-y-6">
      {product.color?.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            انتخاب رنگ
          </label>
          <div className="flex gap-4 flex-wrap">
            {product.color.map((c) => (
              <ColorOption
                key={c.id}
                color={c}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
              />
            ))}
          </div>
        </div>
      )}

      {product.material?.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            انتخاب جنس
          </label>
          <RadioGroup
            orientation="horizontal"
            value={selectedMaterial ? String(selectedMaterial.id) : ""}
            onValueChange={(val) => {
              const mat = product.material.find((m) => String(m.id) === val);
              if (mat) setSelectedMaterial(mat);
            }}
            classNames={{ wrapper: "gap-7" }}
            size="md"
          >
            {product.material.map((m) => (
              <MaterialOption
                key={m.id}
                material={m}
                selectedMaterial={selectedMaterial}
                onSelect={setSelectedMaterial}
              />
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
