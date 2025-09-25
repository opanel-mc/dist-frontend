"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BrandIcon from "@/assets/brand-light.svg";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-14 border-b-1 pb-3">
        <Image src={BrandIcon} alt="brand" width={300}/>
        <div className="w-full flex gap-2 max-sm:grid grid-cols-2 grid-rows-2 [&_label]:text-sm [&>*]:flex-1">
          <div className="flex flex-col gap-2">
            <Label>服务端</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择服务端..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="Fabric">Fabric</SelectItem>
                <SelectItem value="Forge">Forge</SelectItem>
                <SelectItem value="Neoforge">Neoforge</SelectItem>
                <SelectItem value="Bukkit">Bukkit</SelectItem>
                <SelectItem value="Folia">Folia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>游戏版本</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择游戏版本..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="1.21.8">1.21.8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>OPanel 版本</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择OPanel版本..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="1.0.0rc6">1.0.0rc6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>下载源</Label>
            <Select defaultValue="opanel">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择下载源..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opanel">OPanel</SelectItem>
                <SelectItem value="chuqiyun">初七云</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>文件名</TableHead>
              <TableHead className="text-center">平台</TableHead>
              <TableHead>游戏版本</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>opanel-bukkit-1.21-build-1.0.0rc6.jar</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">Bukkit</Badge>
              </TableCell>
              <TableCell className="[&>*]:inline-block w-44 wrap-anywhere whitespace-pre-wrap">
                <Badge variant="secondary">1.21</Badge>
                <Badge variant="secondary">1.21.1</Badge>
                <Badge variant="secondary">1.21.2</Badge>
                <Badge variant="secondary">1.21.3</Badge>
                <Badge variant="secondary">1.21.4</Badge>
                <Badge variant="secondary">1.21.5</Badge>
                <Badge variant="secondary">1.21.6</Badge>
                <Badge variant="secondary">1.21.7</Badge>
                <Badge variant="secondary">1.21.8</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon">
                  <Download />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
