import React, { ReactNode } from 'react';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

@Exclude()
export class TemplateDto {
	@Expose()
	@IsPositive()
	@IsNumber()
	public width: number = 0;

	@Expose()
	@IsPositive()
	@IsNumber()
	public height: number = 0;

	public get render(): ReactNode {
		if (!this.width || !this.height) {
			return null;
		}

		return (
			<div
				style={{
					border: '1px solid black',
					width: this.width,
					height: this.height,
				}}
			/>
		);
	}
}
