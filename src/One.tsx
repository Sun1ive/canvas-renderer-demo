import { classToClass, plainToClass } from 'class-transformer';
import React, { useEffect, useMemo, useState } from 'react';
import { NumericInput } from './components/numeric.input/numeric.input';
import { TemplateDto } from './dto/template.dto';
import { getPersistedData, persistData } from './helpers/persist.data';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import equal from 'fast-deep-equal';
import { BaseInput } from './components/base.input/base.input';

const useStyles = makeStyles(() => {
	return {
		container: {
			display: 'grid',
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
	};
});

const TEMPLATE_LIB_KEY = 'templateLib';

type TemplateLibType<T> = {
	bounds: T;
	name: string;
};

function getDefaultState() {
	return [
		{ name: 'testTemplate', bounds: plainToClass(TemplateDto, { width: 300, height: 200 }) },
		{ name: 'secondTemplate', bounds: plainToClass(TemplateDto, { width: 500, height: 150 }) },
	];
}

function makeState(value: string): TemplateLibType<TemplateDto>[] {
	try {
		const parsed = JSON.parse(value) as TemplateLibType<string>[];
		if (parsed.length === 0) {
			persistData(TEMPLATE_LIB_KEY, JSON.stringify(getDefaultState()));
			return makeState(getPersistedData(TEMPLATE_LIB_KEY)!);
		}

		return parsed.map(({ name, bounds }) => ({
			name,
			bounds: plainToClass(TemplateDto, bounds),
		}));
	} catch (error) {
		persistData(TEMPLATE_LIB_KEY, JSON.stringify(getDefaultState()));
		return makeState(getPersistedData(TEMPLATE_LIB_KEY)!);
	}
}

export const One = () => {
	const styles = useStyles();
	const [templateLib, setTemplateLib] = useState<TemplateLibType<TemplateDto>[]>(() => {
		const persisted = getPersistedData(TEMPLATE_LIB_KEY);
		if (persisted === null) {
			persistData(TEMPLATE_LIB_KEY, JSON.stringify(getDefaultState()));
			return makeState(getPersistedData(TEMPLATE_LIB_KEY)!);
		} else {
			return makeState(persisted);
		}
	});

	const [activeTemplateIndex, setTemplateIndex] = useState(0);

	const [template, setTemplate] = useState<TemplateLibType<TemplateDto>>(() => {
		return templateLib[activeTemplateIndex];
	});

	const patchTemplate = <Key extends keyof TemplateDto>(key: Key, value: TemplateDto[Key]) => {
		setTemplate((prev) => {
			const dto = classToClass(prev.bounds);
			dto[key] = value;
			return {
				...prev,
				bounds: dto,
			};
		});
	};

	useEffect(() => {
		console.log("Render")
	});

	const isChanged = useMemo(() => {
		if (templateLib.length === 0) {
			return true;
		}
		return !equal(template, templateLib[activeTemplateIndex].bounds);
	}, [template, templateLib, activeTemplateIndex]);

	return (
		<div className={styles.container}>
			<Paper elevation={3} style={{ width: '80%' }}>
				<form
					style={{ display: 'flex', flexFlow: 'column wrap', padding: '18px 36px' }}
					noValidate
					onSubmit={(e) => e.preventDefault()}
				>
					<BaseInput
						label="name"
						value={template.name}
						onChange={(e) => {
							setTemplate((prev) => ({ ...prev, name: e.target.value }));
						}}
					/>
					<NumericInput
						label="Width"
						placeholder="width"
						value={template.bounds.width}
						onChangeCb={(value) => {
							patchTemplate('width', value);
						}}
					/>
					<NumericInput
						label="Height"
						placeholder="Height"
						value={template.bounds.height}
						onChangeCb={(value) => {
							patchTemplate('height', value);
						}}
					/>
					<Button
						onClick={() => {
							setTemplateLib((prev) => {
								const newState = [...prev];
								newState[activeTemplateIndex] = template;
								persistData(TEMPLATE_LIB_KEY, JSON.stringify(newState));
								return newState;
							});
						}}
						style={{ marginTop: 8 }}
						variant="contained"
						color="primary"
					>
						Update
					</Button>
					<Button
						onClick={() => {
							setTemplateLib((prev) => {
								const newState = [...prev, { name: template.name, bounds: template.bounds }];
								persistData(TEMPLATE_LIB_KEY, JSON.stringify(newState));
								return newState;
							});
						}}
						disabled={!isChanged}
						style={{ marginTop: 8 }}
						variant="contained"
						color="primary"
					>
						Add
					</Button>
					<Button
						onClick={() => {
							setTemplateLib((prev) => {
								const newState = [...prev].filter((_, idx) => idx !== activeTemplateIndex);
								persistData(TEMPLATE_LIB_KEY, JSON.stringify(newState));
								return newState;
							});
						}}
					>
						Delete
					</Button>
				</form>
			</Paper>
			<div>{template.bounds.render}</div>
			<div>
				<ul>
					{templateLib.map((templateItem, idx) => (
						<li style={{ margin: 4 }} key={idx}>
							<Paper
								onClick={() => {
									setTemplate(templateItem);
									setTemplateIndex(idx);
								}}
								style={{ padding: 6, cursor: 'pointer' }}
								elevation={2}
							>
								{templateItem.name}
							</Paper>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
