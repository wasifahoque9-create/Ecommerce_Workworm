<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrl = $this->getCategoryImageUrl();

        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type,
            'image_url' => $imageUrl,
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'created_at' => $this->created_at,
        ];
    }

    private function getCategoryImageUrl(): ?string
    {
        $product = Product::query()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->where('category_id', $this->id)
                    ->orWhereHas('categories', function ($categoryQuery) {
                        $categoryQuery->where('categories.id', $this->id);
                    });
            })
            ->with(['images' => function ($query) {
                $query->orderByDesc('is_primary')->orderBy('id');
            }])
            ->first();

        if (! $product || ! $product->images->first()) {
            return null;
        }

        return rtrim(config('app.url'), '/') . '/storage/' . ltrim($product->images->first()->image_path, '/');
    }
}
